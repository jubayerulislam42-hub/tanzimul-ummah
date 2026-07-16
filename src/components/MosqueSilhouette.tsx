export default function MosqueSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M0 120V70h40v-10h20v10h30V50h14v20h36V40h16v30h40V30h18v40h44V45h14v25h40V35h18v45h48V40h16v40h44V50h14v20h30v-10h20v10h40v-8h18v8h40V45h14v25h40V35h18v45h48V40h16v40h44V50h14v20h30v-10h20v10h40v-8h18v8h40V45h14v25h40V35h18v45h48V40h16v40h44V50h14v20h30v-10h20v10h40v50z"
      />
      <g fill="currentColor">
        <rect x="150" y="20" width="10" height="50" rx="3" />
        <rect x="600" y="6" width="12" height="64" rx="4" />
        <rect x="1050" y="20" width="10" height="50" rx="3" />
      </g>
    </svg>
  );
}
