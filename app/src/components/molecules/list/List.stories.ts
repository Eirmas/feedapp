import type { Meta, StoryFn } from '@storybook/vue3';
import { action } from '@storybook/addon-actions';
import List from './List.vue';
import ListItem from './components/list-item/ListItem.vue';
import Card from '../../atoms/card/Card.vue';
import ListDivider from './components/list-divider/ListDivider.vue';
import ListSubheader from './components/list-subheader/ListSubheader.vue';
import ListGroup from './components/list-group/ListGroup.vue';
import { html } from 'code-tag';
import { UserGroupIcon as Icon } from '@heroicons/vue/24/outline';

const meta = {
  title: 'Molecules/List',
  component: List,
  tags: ['autodocs'],
} satisfies Meta<typeof List>;

const Template: StoryFn<typeof List> = (args, { updateArgs }) => ({
  components: {
    List,
    ListItem,
    ListGroup,
    ListDivider,
    ListSubheader,
    Card,
  },
  setup() {
    return { args, Icon };
  },
  template: html`<Card dense>
    <List
      v-bind="args"
      @update:selected="updateModel($event, 'update:selected')"
      @update:opened="updateModel($event, 'update:opened')"
      @click:open="updateModel($event, 'click:open')"
      @click:select="updateModel($event, 'click:select')"
    >
      <ListSubheader title="Group 1" />
      <ListItem title="Item 1" :prependIcon="Icon" value="1" />
      <ListItem title="Item 2" :prependIcon="Icon" />
      <ListItem title="Item 3" active :prependIcon="Icon" :appendIcon="Icon" />
      <ListDivider />
      <ListItem value="4" title="Item 4" :appendIcon="Icon" description="Lorem ipsum " />
      <ListItem value="5" title="Item 5" />
      <ListItem value="6" title="Item 6 - href" href="#" />
      <ListItem
        value="7"
        title="Item 7"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nis nisi vitae nisl."
      />
      <ListDivider />
      <ListGroup value="Group 1" :prependIcon="Icon" title="Group">
        <ListItem value="8" title="Item 8" :appendIcon="Icon" description="Lorem ipsum " />
        <ListItem value="9" title="Item 9 - Active" active />
        <ListItem value="10" title="Item 10 - href" href="#" />
        <ListGroup value="Group 2" :prependIcon="Icon" title="Group">
          <ListItem value="11" title="Item 11" :appendIcon="Icon" description="Lorem ipsum " />
          <ListItem value="12" title="Item 12" />
          <ListItem value="13" title="Item 13 - href" href="#" />
        </ListGroup>
      </ListGroup>
      <ListSubheader title="Group 1" />
    </List>
  </Card>`,
  methods: {
    updateModel(modelValue: number, event: string) {
      action(event)(modelValue);
    },
  },
});

export const Default = Template.bind({});
Default.args = {
  nav: true,
};

export default meta;
