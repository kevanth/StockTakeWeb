import Link from "next/link";

export default function Page() 
{
    
    return(
        <div>
            <Link href="/login">Login</Link>
            <br></br>
            <Link href="/inventory">Inventory</Link>
        </div>
    )
}