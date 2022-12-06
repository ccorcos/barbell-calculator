import React, { useLayoutEffect, useMemo, useState } from "react"

function useLocalState<T>(name: string, initialState: T) {
	const initial = useMemo(() => {
		try {
			const result = localStorage.getItem(name)
			if (result === null) return initialState
			const obj = JSON.parse(result)
			return obj
		} catch (error) {
			return initialState
		}
	}, [name])

	const [state, setState] = useState(initial)

	useLayoutEffect(() => {
		try {
			localStorage.setItem(name, JSON.stringify(state))
		} catch (error) {}
	}, [state])

	return [state, setState] as const
}

export function App() {
	const [barWeight, setBarWeight] = useLocalState<number>("barWeight", 45)
	const [plates, setPlates] = useLocalState<number[]>("plates", [])

	const addPlate = (weight: number) => () => {
		setPlates((list) => [...list, weight])
	}

	const removePlate = (index: number) => () => {
		setPlates((list) => list.filter((_, i) => i !== index))
	}

	const totalWeight = plates.reduce((a, b) => a + b, barWeight)

	return (
		<div>
			<h2>Barbell Calculator</h2>

			<p>
				<strong>Total:</strong> {totalWeight}
			</p>

			<div>
				<Barbell barWeight={barWeight} setBarWeight={setBarWeight}>
					{plates.map((weight, i) => (
						<PlateSide weight={weight} onClick={removePlate(i)} />
					))}
				</Barbell>
			</div>

			<hr style={{ margin: "22px 0" }} />
			<div style={{ display: "flex" }}>
				<PlateSide weight={5} onClick={addPlate(5)} />
				<PlateSide weight={10} onClick={addPlate(10)} />
				<PlateSide weight={15} onClick={addPlate(15)} />
				<PlateSide weight={25} onClick={addPlate(25)} />
				<PlateSide weight={35} onClick={addPlate(35)} />
				<PlateSide weight={45} onClick={addPlate(45)} />
			</div>
		</div>
	)
}

const graphicHeight = 220
const maxPlateRadius = 200
const barColor = "#444"

function Barbell({
	barWeight,
	setBarWeight,
	children,
}: {
	barWeight: number
	setBarWeight: any
	children: JSX.Element
}) {
	// 15 * m + b = 16
	// 45 * m + b = 24

	const low = 16
	const high = 24

	// const b = low - 15 * m
	// 45 * m + low - 15 * m = high

	const m = (high - low) / (45 - 15)
	const b = low - 15 * m

	const barThickness = barWeight * m + b
	console.log(m, b)

	const stopThickness = 3.0 * barThickness
	const stopWidth = stopThickness * 0.5

	return (
		<div style={{ position: "relative", height: graphicHeight }}>
			<div
				style={{
					position: "absolute",
					top: graphicHeight / 2 - barThickness / 2,
					maxWidth: "90vw",
					width: 400,
					height: barThickness,
					background: barColor,
				}}
			></div>

			<div
				style={{
					position: "absolute",
					top: graphicHeight / 2 - stopThickness / 2,
					left: stopWidth,
					width: stopWidth,
					height: stopThickness,
					background: barColor,
					color: "white",
					textAlign: "center",
					lineHeight: 2,
				}}
			>
				{barWeight}
			</div>
			<select
				value={barWeight}
				onChange={(e) => {
					setBarWeight(parseInt(e.target.value))
				}}
				style={{
					position: "absolute",
					top: graphicHeight / 2 - stopThickness / 2,
					left: stopWidth,
					width: stopWidth,
					height: stopThickness,
					opacity: 0,
				}}
			>
				<option value={15}>15</option>
				<option value={35}>35</option>
				<option value={45}>45</option>
			</select>
			<div
				style={{
					display: "flex",
					position: "absolute",
					left: stopWidth * 2 + 4,
					height: graphicHeight,
				}}
			>
				{children}
			</div>
		</div>
	)
}

function plateRadius(weight: number) {
	// 5 * m + b = 100
	// 45 * m + b = 24

	const low = 100
	const high = maxPlateRadius

	// const b = low - 5 * m
	// 45 * m + low - 5 * m = high

	const m = (high - low) / (45 - 5)
	const b = low - 5 * m

	const radius = weight * m + b
	return radius
}

function plateWidth(weight: number) {
	// 5 * m + b = 30
	// 45 * m + b = 50

	const low = 30
	const high = 50

	// const b = low - 5 * m
	// 45 * m + low - 5 * m = high

	const m = (high - low) / (45 - 5)
	const b = low - 5 * m

	const result = weight * m + b
	return result
}

function PlateCircle({
	weight,
	onClick,
}: {
	weight: number
	onClick: () => void
}) {
	const radius = plateRadius(weight)

	return (
		<div
			style={{
				margin: 4,
				height: radius,
				width: radius,
				borderRadius: 999999,
				background: "#999",
				textAlign: "center",
				lineHeight: 2,
			}}
			onClick={onClick}
		>
			{weight}
		</div>
	)
}

function PlateSide({
	weight,
	onClick,
}: {
	weight: number
	onClick: () => void
}) {
	const radius = plateRadius(weight)
	const width = plateWidth(weight)

	return (
		<div
			style={{
				marginRight: 2,
				height: radius,
				width: width,
				borderRadius: 3,
				background: "#999",
				textAlign: "center",
				alignSelf: "center",
				lineHeight: 2,
			}}
			onClick={onClick}
		>
			{weight}
		</div>
	)
}
