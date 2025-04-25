window.onload = () => {
    const canvas = document.getElementById('treeCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const backgroundImage = new Image();
    backgroundImage.src = 'assets/night-forest2.jpg'; // <-- Replace with your image path

    backgroundImage.onload = () => {
        class Branch {
            constructor(x, y, angle, length, width, depth = 0) {
                this.x = x;
                this.y = y;
                this.angle = angle;
                this.length = length;
                this.width = width;
                this.depth = depth;
                this.points = [];
                this.grownLength = 0;
                this.active = true;
                this.color = '#52480a'; // Brown color for branches
            }

            grow() {
                if (!this.active) return [];

                const deltaAngle = (Math.random() - 0.5) * 0.1;
                this.angle += deltaAngle;

                const last = this.points.length
                    ? this.points[this.points.length - 1]
                    : { x: this.x, y: this.y };

                const newX = last.x + Math.cos(this.angle) * 1;
                const newY = last.y + Math.sin(this.angle) * 1;
                this.points.push({ x: newX, y: newY });
                this.grownLength += 0.75;

                if (this.grownLength >= this.length) {
                    this.active = false;
                    return this.split();
                }

                return [];
            }

            split() {
                if (this.width < 1 || this.depth > 5) return [];

                const numChildren = Math.random() > 0.5 ? 2 : 3;
                const angleSpread = Math.PI / 2;
                const end = this.points[this.points.length - 1];
                const children = [];

                for (let i = 0; i < numChildren; i++) {
                    const angleOffset = -angleSpread / 2 + (angleSpread / (numChildren - 1)) * i;
                    const newAngle = this.angle + angleOffset;
                    const newLength = this.length * (0.6 + Math.random() * 0.2);
                    const newWidth = Math.max(1, this.width - 1.8);
                    children.push(new Branch(end.x, end.y, newAngle, newLength, newWidth, this.depth + 1));
                }

                return children;
            }

            draw(ctx) {
                if (this.points.length < 2) return;
                ctx.strokeStyle = this.color;
                ctx.lineWidth = this.width;
                ctx.beginPath();
                ctx.moveTo(this.points[0].x, this.points[0].y);
                for (let p of this.points) {
                    ctx.lineTo(p.x, p.y);
                }
                ctx.stroke();
            }
        }

        function createTree() {
            let branches = [
                new Branch(canvas.width / 2, canvas.height, -Math.PI / 2, 135, 12)
            ];

            function animate() {
                ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Draw background

                let newBranches = [];

                for (let branch of branches) {
                    branch.draw(ctx);
                    const children = branch.grow();
                    newBranches.push(...children);
                }

                branches = branches.concat(newBranches);

                if (branches.every(branch => !branch.active)) {
                    setTimeout(() => {
                        branches = [
                            new Branch(canvas.width / 2, canvas.height, -Math.PI / 2, 135, 12)
                        ];
                        animate();
                    }, 3000);
                } else {
                    requestAnimationFrame(animate);
                }
            }

            animate();
        }

        createTree();
    };
};
