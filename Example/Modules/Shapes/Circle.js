var Vector2 = NS.Import('../Structs/Vector2');

function Circle(option)
{
    this.position = new Vector2(option.x, option.y);
    this.radius = option.radius;
}
Circle.prototype.Print = function()
{
    console.log('A circle');
}