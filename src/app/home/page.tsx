import Link from "next/link"

export default function (){
    return <div className="home">
    <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center gap-4">
        <div className="  ">
        <img src="/image.png" className="h-[40vh] p-4  border-4 rounded-full bg-black bg-opacity-20" />

        </div>
    <h1 className="font-sans tracking-widest font-semibold	">Harvest.AI</h1>
    <button  className=" bg-emerald-950 border border-emerald-200 p-2.5 px-3 rounded-xl text-emerald-200 hover:scale-105 bg-opacity-60 ">
        <Link className=" text-emerald-200 hover:scale-105 px-3 text-base" href="/">
    Get Started 
    </Link>
    </button>
    </div>
    
    </div>
}