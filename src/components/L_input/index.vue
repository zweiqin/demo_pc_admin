<template>
  <div>
		<el-form>
			<el-form-item :label="config.label">
				<el-input v-model="config.value" :placeholder="config.placeholder" style="width:20%" size="small"></el-input>
			</el-form-item>
		</el-form>
  </div>
</template>

<script>
export default {
	name:'L-input',
	props: ['config'],
	// data(){
	// 	return{
	// 		// input:'',
	// 	}
	// }

}
</script>

<style>

</style>