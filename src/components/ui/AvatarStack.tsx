import Image from 'next/image'

export default function AvatarStack() {
  const avatars = [
    'https://ui-avatars.com/api/?name=John+Smith&background=1A1A2E&color=C9A84C&size=64',
    'https://ui-avatars.com/api/?name=Emma+Wilson&background=1A1A2E&color=C9A84C&size=64',
    'https://ui-avatars.com/api/?name=Michael+Brown&background=1A1A2E&color=C9A84C&size=64',
  ]

  return (
    <div className="flex items-center -space-x-2">
      {avatars.map((avatar, i) => (
        <div
          key={i}
          className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden"
        >
          <Image
            src={avatar}
            alt=""
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>
      ))}
    </div>
  )
}
