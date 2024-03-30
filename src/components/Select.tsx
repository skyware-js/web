import { clsx } from "clsx/lite";
import type { HTMLProps } from "react";

export type SelectProps = HTMLProps<HTMLSelectElement> & {
	label: string;
	options: Array<{ value: string; label: string } | string>;
};

export function Select({ label, options, ...props }: SelectProps) {
	return (
		<>
			<label htmlFor={props.id} className="sr-only">{label}</label>
			<select
				{...props}
				className={clsx(
					"block bg-gray-100 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 hover:border-gray-500 focus:border-gray-500 text-docs-base leading-6 text-gray-700",
					props.className,
				)}
			>
				{options.map((val) => {
					const { value, label } = typeof val === "string"
						? { value: val, label: val }
						: val;
					return <option key={value} value={value}>{label}</option>;
				})}
			</select>
		</>
	);
}
