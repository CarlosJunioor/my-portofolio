import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center pt-28 text-center">
      <p className="telemetry">// SIGNAL LOST — 404</p>
      <h1 className="text-nebula font-display mt-4 text-6xl font-extrabold">
        Lost in space
      </h1>
      <p className="mt-4 max-w-md text-muted">
        This coordinate doesn&apos;t exist on the star map. Let&apos;s get you back on
        course.
      </p>
      <Link
        href="/"
        className="glass mt-8 rounded-full px-6 py-3 font-mono text-sm uppercase tracking-wider transition-all hover:-translate-y-0.5 hover:glow-cyan"
      >
        Return to base →
      </Link>
    </div>
  );
}
