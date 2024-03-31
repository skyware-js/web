import { AnchorIcon } from "@/assets/icons/AnchorIcon.tsx";
import { ExternalIcon } from "@/assets/icons/ExternalIcon.tsx";
import { clsx } from "clsx/lite";
import type { HTMLProps } from "react";

const HeadingLevels = { h1: "text-code-h1", h2: "text-code-h2", h3: "text-code-h3" };

export default function CodeHeading(
	{ className, level, url, children, ...props }: {
		level: keyof typeof HeadingLevels;
		url?: string | null | undefined;
		id: string;
	} & HTMLProps<HTMLHeadingElement>,
) {
	const HeadingComponent = level;
	const headingLevel = HeadingLevels[level];
	return (
		<HeadingComponent
			className={clsx(
				headingLevel,
				"inline-flex gap-2 items-center group",
				"font-mono",
				level === "h1" ? "font-medium" : "font-normal",
				className,
			)}
			{...props}
		>
			<span>{children}</span>
			<a
				className="text-gray-700 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
				href={`#${props.id}`}
				aria-label="Anchor link to the page title"
			>
				<AnchorIcon className="h-4 w-4 fill-current" />
			</a>
			{url && (
				<a
					href={url}
					className="text-gray-700 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="View source on GitHub"
				>
					<ExternalIcon className="h-4 w-4 fill-current" />
				</a>
			)}
		</HeadingComponent>
	);
}
