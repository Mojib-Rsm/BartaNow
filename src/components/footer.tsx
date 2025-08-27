export default function Footer() {
  return (
    <footer className="bg-card mt-auto py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} BartaNow. All rights reserved.</p>
      </div>
    </footer>
  );
}
