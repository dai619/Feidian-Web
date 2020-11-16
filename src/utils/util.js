export function confirmDelete() {
	return this.$confirm('确认删除?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
}