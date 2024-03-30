import { clsx } from "clsx/lite";

const HeadingLevels = { h1: "text-code-h1", h2: "text-code-h2", h3: "text-code-h3" };

export default function CodeHeading(
	{ level, id, children }: {
		level: keyof typeof HeadingLevels;
		id?: string;
		children: React.ReactNode;
	},
) {
	const HeadingComponent = level;
	const className = HeadingLevels[level];
	return (
		<HeadingComponent
			className={clsx(className, "font-mono", level === "h1" ? "font-medium" : "font-normal")}
			id={id?.replace(/\s/g, "-").toLowerCase()}
		>
			{children}
		</HeadingComponent>
	);
}
