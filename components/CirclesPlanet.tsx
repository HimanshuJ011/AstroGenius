import OrbitingCircles from "@/components/ui/orbiting-circles";
import Image from "next/image";

const Icons = {
  mercury: () => (
    <Image
      src="https://img.icons8.com/?size=100&id=62032&format=png&color=000000"
      alt=""
      width={50}
      height={50}
      className="z-50"

    />
  ),
  moon: () => (
    <Image
      src="https://img.icons8.com/?size=100&id=62034&format=png&color=000000"
      alt=""
      width={50}
      height={50}
    />
  ),
  venus: () => (
    <Image
      src="https://img.icons8.com/?size=100&id=7kY6NvvyuPc7&format=png&color=000000"
      alt=""
      width={50}
      height={50}
      className="z-50"

    />
  ),
  earth: () => (
    <Image
      src="https://img.icons8.com/?size=100&id=63764&format=png&color=000000"
      alt=""
      width={50}
      height={50}
      className="z-50"

    />
  ),
  mars: () => (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="#B22222"
        stroke="#8B0000"
        strokeWidth="3"
      />
      <path
        d="M30 35 Q50 25, 70 35 Q60 50, 30 35"
        fill="#DC143C"
        stroke="#CD5C5C"
        strokeWidth="2"
      />
    </svg>
  ),
  jupiter: () => (
    <Image
      src="https://img.icons8.com/?size=100&id=62037&format=png&color=000000"
      alt=""
      width={50}
      height={50}
      className="z-50"
    />
  ),
  saturn: () => (
    <Image
    src="  https://img.icons8.com/?size=100&id=YqMlvWqcVJJZ&format=png&color=000000"
    alt=""
    width={50}
    height={50}
    className="z-50"
    />
  ),
};
export const OrbitingCirclesPlanet = () => {
  return (
    <div className="absolute top-1/4  h-[500px] w-full flex  flex-col items-center justify-center overflow-hidden opacity-20">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-black">
        <Image
          src="https://img.icons8.com/?size=100&id=62039&format=png&color=000000"
          alt=""
          width={50}
          height={50}
        />
      </span>

      {/* Inner Circles */}
      <OrbitingCircles
        className="size-[30px] border-none bg-transparent"
        duration={20}
        delay={20}
        radius={80}
      >
        <Icons.mercury />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[30px] border-none bg-transparent"
        duration={20}
        delay={35}
        radius={140}
      >
        <Icons.moon />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[30px] border-none bg-transparent"
        duration={20}
        delay={24}
        radius={140}
      >
        <Icons.earth />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[30px] border-none bg-transparent"
        duration={20}
        delay={15}
        radius={80}
      >
        <Icons.venus />
      </OrbitingCircles>

      {/* Outer Circles (reverse) */}
      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        radius={190}
        duration={20}
        reverse
      >
        <Icons.jupiter />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        radius={190}
        duration={20}
        delay={20}
        reverse
      >
        <Icons.saturn />
      </OrbitingCircles>
    </div>
  );
}
