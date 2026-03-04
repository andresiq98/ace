export function generateStaticParams() {
    return [{ groupId: "placeholder", drillId: "sniper-do-saque" }];
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
