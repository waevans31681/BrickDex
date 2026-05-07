const COLOR_MAP = {
  gray:  'bg-gray-100  text-gray-500  dark:bg-zinc-700 dark:text-gray-400',
  blue:  'bg-blue-100  text-blue-600  dark:bg-blue-900/40 dark:text-blue-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
  red:   'bg-red-100   text-red-600   dark:bg-red-900/40 dark:text-red-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
}

export default function Badge({ children, color = 'gray' }) {
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${COLOR_MAP[color] ?? COLOR_MAP.gray}`}>
      {children}
    </span>
  )
}
