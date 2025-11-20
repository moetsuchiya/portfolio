"use client"
type Props = {
    threadId: string;
};

export default function ApproveRejectButtons({ threadId }: Props) {
    async function handleClick(newStatus: "APPROVED" | "REJECTED") {
        console.log("ステータス変更");
    }

    return (
        <div className="mt-3 flex gap-2">
            <button
                className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                onClick={() => handleClick("APPROVED")}
            >
                承認
            </button>
            <button
                className="px-3 py-1 text-xs rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                onClick={() => handleClick("REJECTED")}
            >
                却下
            </button>
        </div>
    );
}
