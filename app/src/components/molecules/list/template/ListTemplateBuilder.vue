<template>
  <template v-for="item in items">
    <ListDivider v-if="isDivider(item)" v-bind="item"></ListDivider>
    <ListSubheader v-else-if="isSubheader(item)" v-bind="item"></ListSubheader>
    <ListGroup v-else-if="isGroup(item)" v-bind="item"></ListGroup>
    <ListItem v-else v-bind="item"></ListItem>
  </template>
</template>

<script lang="ts" setup>
import { IListDivider, IListItems, IListGroup, IListSubheader } from '../types';
import ListDivider from '../components/list-divider/ListDivider.vue';
import ListSubheader from '../components/list-subheader/ListSubheader.vue';
import ListGroup from '../components/list-group/ListGroup.vue';
import ListItem from '../components/list-item/ListItem.vue';

interface Props {
  items: IListItems;
}

defineProps<Props>();

const isDivider = (item: IListItems[number]): item is IListDivider => {
  return 'type' in item && item.type === 'divider';
};

const isSubheader = (item: IListItems[number]): item is IListSubheader => {
  return 'type' in item && item.type === 'subheader';
};

const isGroup = (item: IListItems[number]): item is IListGroup => {
  return 'items' in item;
};
</script>
