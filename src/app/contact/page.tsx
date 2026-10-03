import { PublicLayout } from "@/components/site/public-layout";
import { ContactPage } from "@/components/pages/contact-page";
import { db } from "@/lib/db";

export default async function Page() {
  let contact: Record<string, string> = {};
  try {
    const items = await db.contactSetting.findMany({ where: { visible: true } });
    for (const c of items) contact[c.key] = c.value;
  } catch (err) {
    console.error(err);
  }
  return (
    <PublicLayout>
      <ContactPage contact={contact} />
    </PublicLayout>
  );
}
