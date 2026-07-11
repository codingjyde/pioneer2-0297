import { Page } from "../components/layout";
import { Container, LinkButton } from "../components/ui-kit";

export default function NotFound() {
  return (
    <Page>
      <section className="flex min-h-[60vh] items-center">
        <Container className="text-center">
          <div className="font-display text-8xl text-red md:text-9xl">404</div>
          <h1 className="mt-4 font-display text-3xl text-navy md:text-4xl">This page is still unmapped</h1>
          <p className="mx-auto mt-3 max-w-md text-ink/70">
            The territory you&apos;re looking for isn&apos;t here yet. Head back and keep exploring the vision.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LinkButton href="/" withArrow>Back home</LinkButton>
            <LinkButton href="/editions" variant="outline">Browse editions</LinkButton>
          </div>
        </Container>
      </section>
    </Page>
  );
}
