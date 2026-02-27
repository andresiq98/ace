export function generateStaticParams() {
    return [{ groupId: "group-coxos", drillId: "set-normal" }];
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
