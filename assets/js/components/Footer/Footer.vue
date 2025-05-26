<template>
	<footer class="footer" data-testid="footer">
		<div class="container py-2">
			<div class="d-flex justify-content-between">
				<Savings v-bind="savings" />
			</div>
		</div>
	</footer>
</template>

<script lang="ts">
import "@h2d2/shopicons/es/filled/testtube";

import Savings from "../Savings/Savings.vue";
import { defineComponent } from "vue";

export default defineComponent({
	name: "Footer",
	components: { Savings },
	props: {
		version: Object,
		savings: Object,
	},
});
</script>
