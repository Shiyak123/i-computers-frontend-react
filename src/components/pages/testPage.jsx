import { useState } from "react";

export default function TestPage() {
    const [score, setScore] = useState(1)


    return (
        // Main full-screen wrapper centered using flexbox
        <div className="w-full h-screen bg-[#00c371] flex flex-col justify-center items-center p-8">
            {/* Media Player Card Container */}
            <div className="w-[320px] bg-[#00c371] flex flex-col gap-5 p-6 rounded-xl">

                {/* White Album Art Square */}
                <div className="w-full aspect-square bg-white rounded-md flex flex-col justify-center items-center ">
                    <h1 className="font-bold text-6xl">{score}</h1>
                    <div className="w-full h-[100px] flex justify-center items-center">
                        <button className="w-[100px] h-[40px] bg-red-600 mx-5"
                            onClick={
                                () => {
                                    setScore(score - 1)
                                }
                            }
                        >Decrease</button>
                        <button className="w-[100px] h-[40px] bg-green-600 mx-5"
                            onClick={
                                () => {
                                    setScore(score + 1)
                                }
                            }
                        >Increase  </button>
                    </div>


                </div>
                {/* Bottom Controls Row */}
                <div className="flex items-center gap-3 w-full">

                </div>

            </div>

        </div>
    );
}
