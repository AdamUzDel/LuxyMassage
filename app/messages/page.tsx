import { Metadata } from "next"
import UserMessages from "@/components/user/user-messages"

export const metadata: Metadata = {
  title: "Messages | LuxyDirectory",
  description: "Chat with service providers and manage your conversations",
}

export default function MessagesPage() {
  return <UserMessages />
}
