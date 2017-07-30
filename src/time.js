module.exports = {
    now: function () {
        return (new Date()).toLocaleString() + 'xyza'
    },
    random: function () {
        var a = ['a', 'b', 'c']
        var rel = []
        a.forEach(item=>{
            rel.push(item+Math.random())
        })
        return rel
    }
}