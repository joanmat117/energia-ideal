export default function ArticleCardSkeleton(){
    return (
        <section className="overflow-hidden animate-pulse flex flex-col gap-3 rounded-none sm:rounded-lg">
            <div className="w-full aspect-[21/9] bg-gray-500/50"></div>
            <section className="flex p-3  flex-col gap-2">
                <div className="mt-7 bg-gray-500/50 rounded-full h-5"></div>
                <div className=" bg-gray-500/50 rounded-full h-5"></div>
                <div className="bg-gray-500/50 rounded-full w-[50%] h-3"></div>
            </section>
        </section>
    )
}