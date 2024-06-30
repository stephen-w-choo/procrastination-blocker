import type { Meta, StoryObj } from "@storybook/react"
import { Category } from "../src/data/models/Category"
import OptionsView from "../src/view/option/OptionsView"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Options View",
	component: OptionsView,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {},
} satisfies Meta<typeof OptionsView>

export default meta

type Story = StoryObj<typeof meta>
// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const OptionsExampleView: Story = {
	args: {
		initialThreshold: 50,
		initialKeywords: {
			procrastination: [
				{
					text: "reddit",
					weight: 5,
				},
				{
					text: "youtube",
					weight: 5,
				},
				{
					text: "news",
					weight: 5,
				},
				{
					text: "cooking",
					weight: 5,
				},
				{
					text: "games",
					weight: 5,
				},
			],
			productive: [
				{
					text: "wikipedia",
					weight: 5,
				},
				{
					text: "stack overflow",
					weight: 5,
				},
				{
					text: "github",
					weight: 5,
				},
				{
					text: "career",
					weight: 5,
				},
				{
					text: "business",
					weight: 5,
				},
			],
		},
	},
}
