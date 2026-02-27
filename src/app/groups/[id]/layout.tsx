export function generateStaticParams() {
    return [{ id: "group-coxos" }];
}

export default function GroupDetailLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
