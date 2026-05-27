type Props = {
  title: string;
  value: string;
};

export default function StatCard({
  title,
  value,
}: Props) {
  return (
    <div className="bg-[#0B1727] border border-white/5 rounded-2xl p-6 hover:border-cyan-500/30 transition-all">
      <p className="text-gray-400 text-sm mb-3">
        {title}
      </p>

      <h2 className="text-4xl font-bold tracking-tight">
        {value}
      </h2>
    </div>
  );
}