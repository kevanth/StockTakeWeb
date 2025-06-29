import { JWTPayload, SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function generateToken(payload: JWTPayload) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("2h")
		.sign(secret);
}

export async function verifyToken(token: string) {
	try {
		const { payload } = await jwtVerify(token, secret);
		return payload;
	} catch (err) {
		throw new Error("Invalid or expired token: " + err);
	}
}
