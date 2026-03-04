export function generateStaticParams() {
    return [{ groupId: "mock-group", id: "mock-match" }];
}

export default function AcceptDetailLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
