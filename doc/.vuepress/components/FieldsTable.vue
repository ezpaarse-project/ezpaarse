<template>
  <table>
    <thead>
      <tr>
        <th>Code</th>
        <th>Description</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="row in rows">
        <td>
          {{ row.code }}
        </td>
        <td>
          {{ row.description }}
          <template v-if="row.comment">
            <br> {{ row.comment }}
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    rows: {
      type: Array,
      default: () => []
    }
  }
}
</script>