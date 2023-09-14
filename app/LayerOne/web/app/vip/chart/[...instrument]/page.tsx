'use client';
import { FullNavBar } from "../../navbar/fullnavbar";
import { useRouter } from "next/navigation"

export default function Chart({ params }: { params: { instrument: string } }) {
    return (
        <>
            <div>
                <h1>Asset Name: {params.instrument[0].replace("%20"," ") || "Unkwon"}</h1>
                <h1>Country Name: {params.instrument[1].replace("%20"," ") || "Unkwon"}</h1>

            </div>
        </>
    )
}