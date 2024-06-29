import type { Meta, StoryObj } from "@storybook/react"
import { Category } from "../src/data/models/Category"
import PopUpView from "../src/view/popup/PopUpView"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Pop Up View",
	component: PopUpView,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {},
} satisfies Meta<typeof PopUpView>

export default meta

type Story = StoryObj<typeof meta>
// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const PopUpErrorView: Story = {
	args: {
		modelMetricsVal: null,
		siteDataStateVal: null,
		siteCategoryVal: null,
		siteClassificationStateVal: null,
	},
}

export const PopUpExampleView: Story = {
	args: {
		modelMetricsVal: {
			procrastination: 5,
			productive: 10,
			changesSinceLastSync: 0,
		},
		siteDataStateVal: {
			domain: "example.com",
			title: "Example",
		},
		siteCategoryVal: Category.productive,
		siteClassificationStateVal: {
			success: true,
			modelUntrained: false,
		},
	},
}
