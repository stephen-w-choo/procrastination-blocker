import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import { Category } from "../src/data/models/Category"
import { ContentView } from "../src/view/content/ContentView"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Content View",
	component: ContentView,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {},
} satisfies Meta<typeof ContentView>

export default meta

const ChildComponent: React.FC = () => <div>Child Component</div>

type Story = StoryObj<typeof meta>
// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ContentViewStory: Story = {
	args: {
		isActive: true,
		rerenderTopBar: () => {},
		siteData: {
			domain: "example.com",
			title: "Example",
		},
		siteStatus: {
			procrastinationScore: {
				title: 0.5,
				domain: 0.5,
			},
			trainedOn: {
				productive: 1,
				procrastination: 1,
				changesSinceLastSync: 20,
			},
		},
		siteSeen: Category.procrastination,
	},
}
