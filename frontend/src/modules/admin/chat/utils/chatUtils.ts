export const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0]?.charAt(0)}${parts[parts.length - 1]?.charAt(0)}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const getAvatarBg = (name: string) => {
  const colors = [
    "bg-indigo-50 text-indigo-600 border-indigo-100",
    "bg-violet-50 text-violet-600 border-violet-100",
    "bg-emerald-50 text-emerald-600 border-emerald-100",
    "bg-amber-50 text-amber-600 border-amber-100",
  ];
  return colors[name.length % colors.length];
};
