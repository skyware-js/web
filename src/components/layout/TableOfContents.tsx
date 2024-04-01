import { sortReflections } from "@/util/sortReflections.ts";
import { type ReactNode, useEffect, useMemo } from "react";
import type { DeclarationReflection } from "typedoc";

interface TOCList {
	name: string;
	ctor?: boolean;
	properties?: Array<string>;
	accessors?: Array<string>;
	methods?: Array<string>;
}

export function generateTOC(reflection?: DeclarationReflection | undefined | null): TOCList | null {
	if (!reflection?.children?.length) return null;

	const ctor = reflection.getChildrenByKind(/* ReflectionKind.Constructor */ 512)[0];
	const properties = sortReflections(
		reflection.getChildrenByKind(
			/* ReflectionKind.Property */ 1024 | /* ReflectionKind.EnumMember */ 16,
		),
	).filter(({ flags }) => !flags.isPrivate && !flags.isProtected && !flags.isExternal);
	const accessors = sortReflections(
		reflection.getChildrenByKind(/* ReflectionKind.Accessor */ 262144),
	).filter(({ flags }) => !flags.isPrivate && !flags.isProtected && !flags.isExternal);
	const methods = sortReflections(reflection.getChildrenByKind(/* ReflectionKind.Method */ 2048))
		.filter(({ flags }) => !flags.isPrivate && !flags.isProtected && !flags.isExternal);

	const toc: TOCList = { name: reflection.name };

	if (ctor) toc.ctor = true;
	if (properties.length) toc.properties = properties.map((prop) => prop.name);
	if (accessors.length) toc.accessors = accessors.map((prop) => prop.name);
	if (methods.length) toc.methods = methods.map((method) => method.name);

	return toc;
}

export function TableOfContents({ toc }: { toc: TOCList }): ReactNode {
	const observer = useMemo(() => {
		return typeof window !== "undefined"
			? new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const id = entry.target.id;
						const link = document.querySelector<HTMLAnchorElement>(
							`.toc a[href="#${id}"]`,
						);
						if (link) {
							link.setAttribute("data-visible", "true");
						}
					} else {
						const id = entry.target.id;
						const link = document.querySelector(`.toc a[href="#${id}"]`);
						if (link) {
							link.removeAttribute("data-visible");
						}
					}
				});
			}, { threshold: 0.5 })
			: null;
	}, []);

	useEffect(() => {
		const headers = Array.from(document.querySelectorAll("main h1, main h2, main h3"));
		headers.forEach((header) => {
			if (header.id) {
				observer?.observe(header);
			}
		});
		return () => {
			observer?.disconnect();
		};
	}, []);

	const TOCLink = ({ children: text }: { children: string }) => (
		<li className="pl-3 py-1.5 text-gray-500 font-mono text-docs-base">
			<a
				href={`#${text}`}
				className="hover:text-gray-700 data-[visible]:text-gray-700 data-[visible]:hover:text-gray-900"
			>
				{text}
			</a>
		</li>
	);

	return (
		<ul className="mt-2 toc">
			<TOCLink>{toc.name}</TOCLink>
			{toc.ctor ? <TOCLink>constructor</TOCLink> : null}
			{toc.properties?.length
				? (
					<li className="pl-3 py-2">
						<h4 className="text-gray-500 font-sans text-docs-base pb-1.5">
							<a href="#properties" className="hover:text-gray-700">Properties</a>
						</h4>
						<ul className="text-gray-500 font-mono text-docs-base">
							{toc.properties.map((prop) => <TOCLink key={prop}>{prop}</TOCLink>)}
						</ul>
					</li>
				)
				: null}
			{toc.accessors?.length
				? (
					<li className="pl-3 py-2">
						<h4 className="text-gray-500 text-docs-base font-sans pb-1.5">
							<a href="#accessors" className="hover:text-gray-700">Accessors</a>
						</h4>
						<ul className="text-gray-500 font-mono text-docs-base">
							{toc.accessors.map((prop) => <TOCLink key={prop}>{prop}</TOCLink>)}
						</ul>
					</li>
				)
				: null}
			{toc.methods?.length
				? (
					<li className="pl-3 py-2">
						<h4 className="text-gray-500 text-docs-base font-sans pb-1.5">
							<a href="#methods" className="hover:text-gray-700">Methods</a>
						</h4>
						<ul className="text-gray-500 font-mono text-docs-base">
							{toc.methods.map((method) => <TOCLink key={method}>{method}</TOCLink>)}
						</ul>
					</li>
				)
				: null}
		</ul>
	);
}
