import { clsx } from "clsx/lite";
import type { HTMLProps } from "react";

const HeadingLevels = { h1: "text-code-h1", h2: "text-code-h2", h3: "text-code-h3" };

export default function CodeHeading(
	{ className, level, children, ...props }:
		& { level: keyof typeof HeadingLevels; id?: string }
		& HTMLProps<HTMLHeadingElement>,
) {
	const HeadingComponent = level;
	const headingLevel = HeadingLevels[level];
	return (
		<HeadingComponent
			className={clsx(
				headingLevel,
				"font-mono",
				level === "h1" ? "font-medium" : "font-normal",
				className,
			)}
			{...props}
		>
			{children}
		</HeadingComponent>
	);
}
