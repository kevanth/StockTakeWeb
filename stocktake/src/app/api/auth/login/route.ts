import { loginUser } from "@/lib/auth";
import { NextResponse } from 'next/server'

export async function POST(req:Request) {
	const body = await req.json()
    const { email, password } = body
    console.log(email)
    return NextResponse.json({ status: 'ok' })

}