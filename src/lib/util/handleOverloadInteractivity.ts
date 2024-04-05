const overloadedFunctions = document.querySelectorAll(".overloads");
overloadedFunctions.forEach(({ id }) => {
	const signatures = document.querySelectorAll(`#${id} > div`);
	const buttons = document.querySelectorAll(`#${id}-button-left, #${id}-button-right`);
	const label = document.querySelector(`#${id}-label`);

	if (signatures.length <= 1) {
		buttons.forEach((button) => {
			button.classList.add("disabled");
		});
		return;
	}

	signatures.forEach((signature, i) => {
		signature.classList.toggle("hidden", i !== 0);
	});

	let index = 0;
	const setIndex = (i: number) => {
		index = i;
		signatures.forEach((signature, i) => {
			signature.classList.toggle("hidden", i !== index);
		});
		if (label) label.textContent = `Overload ${index + 1}/${signatures.length}`;
	};

	buttons.forEach((button) => {
		button.addEventListener("click", (event) => {
			event.preventDefault();
			const isLeft = (event.currentTarget as HTMLElement).id.includes("left");
			const nextIndex = isLeft ? index - 1 : index + 1;
			setIndex((nextIndex + signatures.length) % signatures.length);
		});
	});

	setIndex(0);
});
