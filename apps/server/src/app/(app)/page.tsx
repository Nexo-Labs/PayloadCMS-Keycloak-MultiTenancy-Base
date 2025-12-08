import { signInAction } from "@/modules/authjs/actions";
import { auth } from "@/modules/authjs/plugins";
import { AuthStatus } from "../components/AuthStatus";

export default async function HomePage() {
  const session = await auth();
  const user = session?.user
    ? {
        id: session.user.id!,
        email: session.user.email,
        name: session.user.name,
      }
    : null;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Multi-Tenant Example</h1>

      <AuthStatus user={user} signIn={signInAction} />

      <p>
        This multi-tenant example allows you to explore multi-tenancy with
        domains and with slugs.
      </p>

      <h2>Domains</h2>
      <p>
        When you visit a tenant by domain, the domain is used to determine the
        tenant.
      </p>
      <p>
        For example, visiting{" "}
        <a href="http://gold.localhost:3000/tenant-domains/login">
          http://gold.localhost:3000/tenant-domains/login
        </a>{" "}
        will show the tenant with the domain "gold.localhost".
      </p>

      <h2>Slugs</h2>
      <p>
        When you visit a tenant by slug, the slug is used to determine the
        tenant.
      </p>
      <p>
        For example, visiting{" "}
        <a href="http://localhost:3000/tenant-slugs/silver/login">
          http://localhost:3000/tenant-slugs/silver/login
        </a>{" "}
        will show the tenant with the slug "silver".
      </p>
    </div>
  );
}
