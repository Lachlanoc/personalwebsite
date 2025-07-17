import Container from "@/app/_components/container";
import Header from "../_components/header";

export default function ContactPage() {
  return (
    <main>
      <Container>
        <Header />
        <section className="">
          <h1>Contact Me</h1>
          <p>If you have any questions or just want to say hi, feel free to reach out!</p>
        </section>
      </Container>
    </main>
  );
}