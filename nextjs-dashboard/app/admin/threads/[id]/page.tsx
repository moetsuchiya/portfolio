
// params: Next.js が自動で渡してくれる「URL の動的パラメータをまとめたオブジェクト」です。
export default function AdminThreadDetailPage(
    //NOTE 分割代入と型注釈を同時に
    { params }: { params: { id: string } }
) {
    // /admin/threads/abc123 にアクセスしたら
    // params.id === "abc123"
    return (
    <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Thread Detail</h1>
        <p>ID: {params.id}</p>
      {/* 明日ここにチャットUIを入れていく */}
    </div>
    );
}
