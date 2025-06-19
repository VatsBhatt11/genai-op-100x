import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import NextAuth from "next-auth";
import type { Session } from "next-auth";
import bcrypt from "bcryptjs";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      email: string;
      candidateProfileId?: string;
    };
  }
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            throw new Error("Email and password required");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.log("No user found for email:", credentials.email);
            throw new Error("No user found");
          }

          if (!user.password) {
            console.log("User has no password set");
            throw new Error("Invalid user configuration");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.log("Invalid password for user:", credentials.email);
            throw new Error("Invalid password");
          }

          if (user.role === "COMPANY") {
            // Create company profile if it doesn't exist
            const existingProfile = await prisma.companyProfile.findUnique({
              where: { userId: user.id },
            });

            if (!existingProfile) {
              await prisma.companyProfile.create({
                data: {
                  userId: user.id,
                  name: user.email.split("@")[0],
                  description: "Welcome to our platform!",
                },
              });
            }
          }

          console.log("Authentication successful for user:", user.email);
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: any }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      if (token?.role) {
        session.user.role = token.role as string;
      }
      if (token?.candidateProfileId) {
        session.user.candidateProfileId = token.candidateProfileId as string;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role;
        if (user.role === "CANDIDATE") {
          const candidateProfile = await prisma.candidateProfile.findUnique({
            where: { userId: user.id },
            select: { id: true },
          });
          if (candidateProfile) {
            token.candidateProfileId = candidateProfile.id;
          }
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
