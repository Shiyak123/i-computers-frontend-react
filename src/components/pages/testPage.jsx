import { useState } from "react";
import { toast } from "react-hot-toast";
export default function TestPage() {
    const [score, setScore] = useState(1);
    const [mode, setMode] = useState("😐");

    return (
        <div className="w-full h-screen bg-[#00c371] flex justify-center items-center p-8">
            <div className="w-[320px] bg-white rounded-md p-6 flex flex-col items-center gap-6">

                <h1 className="font-bold text-6xl">{score}</h1>

                <div className="flex justify-center gap-4">
                    <button
                        className="w-[100px] h-[40px] bg-red-600 text-white"
                        onClick={() => {
                            setScore(score - 1);
                        }}
                    >
                        Decrease
                    </button>

                    <button
                        className="w-[100px] h-[40px] bg-green-600 text-white"
                        onClick={() => {
                            setScore(score + 1);
                        }}
                    >
                        Increase
                    </button>
                </div>

                <h1 className="text-6xl">{mode}</h1>

                <div className="flex justify-center gap-2">
                    <button className="w-[90px] h-[40px] bg-yellow-500 text-white"
                        onClick={
                            () => {
                                setMode("😊")
                                toast.success("You Are Now On Happy Mode")
                            }
                        }
                    >
                        Happy
                    </button>

                    <button className="w-[90px] h-[40px] bg-gray-500 text-white"
                        onClick={
                            () => {
                                setMode("😐")
                                toast("You Are Now On Nutaral Mode")
                            }
                        }
                    >
                        Neutral
                    </button>

                    <button className="w-[90px] h-[40px] bg-blue-500 text-white" onClick={
                        () => {
                            setMode("😢")
                            toast.success("You Are Now On Sad Mode")
                        }
                    }
                    >
                        Sad
                    </button>
                </div>

            </div>
        </div>
    );
}