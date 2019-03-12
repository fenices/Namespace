var Helper = NS.Import('Helper');

function Vector2(x, y)
{
    this.x = x;
    this.y = y;
    this.h = new Helper();

}

Vector2.prototype.Help = function()
{
    this.h.DoSomethings();
}