$file = "C:\Users\何端端\Desktop\ai生成的小东西\time-planet\app\page.tsx"
$content = Get-Content $file -Raw

# ============ 1. 替换 orbit-1~4 动画为 orbit-move-1~4（圆形运动）============
$oldOrbit = @"
        @keyframes orbit-1 {
          from { transform: rotate(0deg) translateX(180px) translateY(30px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(180px) translateY(30px) rotate(-360deg); }
        }
        @keyframes orbit-2 {
          from { transform: rotate(72deg) translateX(240px) translateY(40px) rotate(-72deg); }
          to { transform: rotate(432deg) translateX(240px) translateY(40px) rotate(-432deg); }
        }
        @keyframes orbit-3 {
          from { transform: rotate(144deg) translateX(300px) translateY(50px) rotate(-144deg); }
          to { transform: rotate(504deg) translateX(300px) translateY(50px) rotate(-504deg); }
        }
        @keyframes orbit-4 {
          from { transform: rotate(216deg) translateX(360px) translateY(60px) rotate(-216deg); }
          to { transform: rotate(576deg) translateX(360px) translateY(60px) rotate(-576deg); }
        }
"@

$newOrbit = @"
        @keyframes orbit-move-1 {
          from { transform: rotate(0deg) translateX(180px); }
          to { transform: rotate(360deg) translateX(180px); }
        }
        @keyframes orbit-move-2 {
          from { transform: rotate(0deg) translateX(240px); }
          to { transform: rotate(360deg) translateX(240px); }
        }
        @keyframes orbit-move-3 {
          from { transform: rotate(0deg) translateX(300px); }
          to { transform: rotate(360deg) translateX(300px); }
        }
        @keyframes orbit-move-4 {
          from { transform: rotate(0deg) translateX(360px); }
          to { transform: rotate(360deg) translateX(360px); }
        }
"@

if (-not $content.Contains($oldOrbit)) {
  Write-Host "ERROR: oldOrbit not found"
  exit 1
}
$content = $content.Replace($oldOrbit, $newOrbit)
Write-Host "Step 1 done: orbit animations replaced"

# ============ 2. 替换土星容器（从 /* Saturn container */ 到 /* Stats */）============
# 2a. 替换轨道装饰环部分
$oldDecor = @"
            {/* Saturn container */}
            <div className="relative my-16 flex items-center justify-center" style={{ width: "700px", height: "550px" }}>
              {/* Elliptical orbit rings decoration */}
              {[
                { rx: 200, ry: 45, color: "rgba(168, 85, 247, 0.3)", speed: 40 },
                { rx: 250, ry: 55, color: "rgba(139, 92, 246, 0.25)", speed: 55 },
                { rx: 300, ry: 65, color: "rgba(99, 102, 241, 0.2)", speed: 70 },
                { rx: 360, ry: 75, color: "rgba(251, 191, 36, 0.15)", speed: 85 },
              ].map((orbit, idx) => (
                <div key={idx}
                  className="absolute rounded-full"
                  style={{
                    width: `${orbit.rx * 2}px`,
                    height: `${orbit.ry * 2}px`,
                    border: `1px solid ${orbit.color}`,
                    animation: `spin-slow ${orbit.speed}s linear infinite`,
                  }}
                />
              ))}
"@

$newDecor = @"
            {/* Saturn container */}
            <div className="relative my-16 flex items-center justify-center" style={{ width: "700px", height: "550px" }}>
              {/* Elliptical orbit rings decoration (horizontal plane only, no rotateX) */}
              {[
                { rx: 200, ry: 45, color: "rgba(168, 85, 247, 0.3)", speed: 40 },
                { rx: 250, ry: 55, color: "rgba(139, 92, 246, 0.25)", speed: 55 },
                { rx: 300, ry: 65, color: "rgba(99, 102, 241, 0.2)", speed: 70 },
                { rx: 360, ry: 75, color: "rgba(251, 191, 36, 0.15)", speed: 85 },
              ].map((orbit, idx) => (
                <div key={idx}
                  className="absolute rounded-full"
                  style={{
                    width: `${orbit.rx * 2}px`,
                    height: `${orbit.ry * 2}px`,
                    border: `1px solid ${orbit.color}`,
                    boxShadow: `0 0 10px ${orbit.color}`,
                  }}
                />
              ))}
"@

if (-not $content.Contains($oldDecor)) {
  Write-Host "ERROR: oldDecor not found"
  exit 1
}
$content = $content.Replace($oldDecor, $newDecor)
Write-Host "Step 2 done: orbit decor replaced"

# ============ 3. 替换角色节点结构（4个轨道节点，添加椭圆容器）============
$oldNodes = @"
              {/* Character orbiting nodes */}
              <div className="absolute top-1/2 left-1/2" style={{ animation: "orbit-1 14s linear infinite" }}>
                <div className="relative" style={{ transform: "translate(-50%, -50%)" }}>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full text-4xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(139, 92, 246, 0.3), rgba(99, 102, 241, 0.2))",
                      border: "2px solid rgba(168, 85, 247, 0.6)",
                      animation: "node-glow 3s ease-in-out infinite",
                      boxShadow: "0 0 40px rgba(168, 85, 247, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    👵
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      background: "linear-gradient(135deg, rgba(168, 85, 247, 0.8), rgba(139, 92, 246, 0.6))",
                      color: "#F5F5F5",
                      boxShadow: "0 0 15px rgba(168, 85, 247, 0.5)",
                    }}
                  >
                    奶奶
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2" style={{ animation: "orbit-2 20s linear infinite" }}>
                <div className="relative" style={{ transform: "translate(-50%, -50%)" }}>
                  <div className="flex h-18 w-18 items-center justify-center rounded-full text-3xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(251, 191, 36, 0.4), rgba(255, 223, 0, 0.3), rgba(168, 85, 247, 0.2))",
                      border: "2px solid rgba(251, 191, 36, 0.6)",
                      animation: "node-glow 3.5s ease-in-out infinite",
                      boxShadow: "0 0 35px rgba(251, 191, 36, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    🐕
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      background: "linear-gradient(135deg, rgba(251, 191, 36, 0.8), rgba(255, 223, 0, 0.6))",
                      color: "#121330",
                      boxShadow: "0 0 15px rgba(251, 191, 36, 0.5)",
                    }}
                  >
                    小狗布丁
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2" style={{ animation: "orbit-3 26s linear infinite" }}>
                <div className="relative" style={{ transform: "translate(-50%, -50%)" }}>
                  <div className="flex h-18 w-18 items-center justify-center rounded-full text-3xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.2))",
                      border: "2px solid rgba(59, 130, 246, 0.6)",
                      animation: "node-glow 4s ease-in-out infinite",
                      boxShadow: "0 0 35px rgba(59, 130, 246, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    👴
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(99, 102, 241, 0.6))",
                      color: "#F5F5F5",
                      boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
                    }}
                  >
                    外公
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2" style={{ animation: "orbit-4 32s linear infinite" }}>
                <div className="relative" style={{ transform: "translate(-50%, -50%)" }}>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full text-4xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(251, 191, 36, 0.5), rgba(255, 223, 0, 0.3), rgba(59, 130, 246, 0.2))",
                      border: "2px solid rgba(251, 191, 36, 0.7)",
                      animation: "node-glow 2.5s ease-in-out infinite",
                      boxShadow: "0 0 45px rgba(251, 191, 36, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    🌟
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      background: "linear-gradient(135deg, rgba(251, 191, 36, 0.9), rgba(255, 223, 0, 0.7))",
                      color: "#121330",
                      boxShadow: "0 0 15px rgba(251, 191, 36, 0.6)",
                    }}
                  >
                    守护星
                  </div>
                </div>
              </div>
"@

# 新的节点结构：外层容器设置不同宽高（椭圆），内层做圆形运动
$newNodes = @"
              {/* Character orbiting nodes on horizontal elliptical orbits */}
              <div className="absolute top-1/2 left-1/2" style={{ width: "360px", height: "90px", transform: "translate(-50%, -50%)" }}>
                <div className="absolute top-1/2 left-1/2" style={{ animation: "orbit-move-1 14s linear infinite" }}>
                  <div className="relative" style={{ transform: "translate(-50%, -50%)" }}>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full text-4xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(139, 92, 246, 0.3), rgba(99, 102, 241, 0.2))",
                        border: "2px solid rgba(168, 85, 247, 0.6)",
                        animation: "node-glow 3s ease-in-out infinite",
                        boxShadow: "0 0 40px rgba(168, 85, 247, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      👵
                    </div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        background: "linear-gradient(135deg, rgba(168, 85, 247, 0.8), rgba(139, 92, 246, 0.6))",
                        color: "#F5F5F5",
                        boxShadow: "0 0 15px rgba(168, 85, 247, 0.5)",
                      }}
                    >
                      奶奶
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2" style={{ width: "480px", height: "110px", transform: "translate(-50%, -50%)" }}>
                <div className="absolute top-1/2 left-1/2" style={{ animation: "orbit-move-2 20s linear infinite" }}>
                  <div className="relative" style={{ transform: "translate(-50%, -50%)" }}>
                    <div className="flex h-18 w-18 items-center justify-center rounded-full text-3xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(251, 191, 36, 0.4), rgba(255, 223, 0, 0.3), rgba(168, 85, 247, 0.2))",
                        border: "2px solid rgba(251, 191, 36, 0.6)",
                        animation: "node-glow 3.5s ease-in-out infinite",
                        boxShadow: "0 0 35px rgba(251, 191, 36, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      🐕
                    </div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        background: "linear-gradient(135deg, rgba(251, 191, 36, 0.8), rgba(255, 223, 0, 0.6))",
                        color: "#121330",
                        boxShadow: "0 0 15px rgba(251, 191, 36, 0.5)",
                      }}
                    >
                      小狗布丁
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2" style={{ width: "600px", height: "130px", transform: "translate(-50%, -50%)" }}>
                <div className="absolute top-1/2 left-1/2" style={{ animation: "orbit-move-3 26s linear infinite" }}>
                  <div className="relative" style={{ transform: "translate(-50%, -50%)" }}>
                    <div className="flex h-18 w-18 items-center justify-center rounded-full text-3xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.2))",
                        border: "2px solid rgba(59, 130, 246, 0.6)",
                        animation: "node-glow 4s ease-in-out infinite",
                        boxShadow: "0 0 35px rgba(59, 130, 246, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      👴
                    </div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(99, 102, 241, 0.6))",
                        color: "#F5F5F5",
                        boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
                      }}
                    >
                      外公
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2" style={{ width: "720px", height: "150px", transform: "translate(-50%, -50%)" }}>
                <div className="absolute top-1/2 left-1/2" style={{ animation: "orbit-move-4 32s linear infinite" }}>
                  <div className="relative" style={{ transform: "translate(-50%, -50%)" }}>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full text-4xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(251, 191, 36, 0.5), rgba(255, 223, 0, 0.3), rgba(59, 130, 246, 0.2))",
                        border: "2px solid rgba(251, 191, 36, 0.7)",
                        animation: "node-glow 2.5s ease-in-out infinite",
                        boxShadow: "0 0 45px rgba(251, 191, 36, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      🌟
                    </div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        background: "linear-gradient(135deg, rgba(251, 191, 36, 0.9), rgba(255, 223, 0, 0.7))",
                        color: "#121330",
                        boxShadow: "0 0 15px rgba(251, 191, 36, 0.6)",
                      }}
                    >
                      守护星
                    </div>
                  </div>
                </div>
              </div>
"@

if (-not $content.Contains($oldNodes)) {
  Write-Host "ERROR: oldNodes not found"
  exit 1
}
$content = $content.Replace($oldNodes, $newNodes)
Write-Host "Step 3 done: character nodes replaced with elliptical orbit containers"

# ============ 4. 替换土星环（多层 3D 旋转环改为扁平椭圆水平环）============
$oldRings = @"
              {/* Saturn rings - Multi-layer gradient rings */}
              <div className="absolute top-1/2 left-1/2" style={{ perspective: "1000px", transform: "translate(-50%, -50%)" }}>
                <div className="relative"
                  style={{
                    width: "550px",
                    height: "550px",
                    transformStyle: "preserve-3d",
                    animation: "spin-slow 80s linear infinite",
                  }}
                >
                  {/* Outer ring */}
                  <div className="absolute top-1/2 left-1/2 rounded-full"
                    style={{
                      width: "520px",
                      height: "520px",
                      transform: "translate(-50%, -50%) rotateX(88deg)",
                      background: "linear-gradient(135deg, rgba(168, 85, 247, 0.7) 0%, rgba(139, 92, 246, 0.6) 20%, rgba(99, 102, 241, 0.5) 40%, rgba(251, 191, 36, 0.4) 50%, rgba(255, 223, 0, 0.5) 60%, rgba(168, 85, 247, 0.6) 80%, rgba(139, 92, 246, 0.7) 100%)",
                      boxShadow: "0 0 50px rgba(168, 85, 247, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.1)",
                      borderRadius: "50%",
                    }}
                  >
                    <div className="absolute inset-4 rounded-full"
                      style={{
                        background: "transparent",
                        border: "8px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                  {/* Middle ring */}
                  <div className="absolute top-1/2 left-1/2 rounded-full"
                    style={{
                      width: "440px",
                      height: "440px",
                      transform: "translate(-50%, -50%) rotateX(88deg)",
                      background: "linear-gradient(135deg, rgba(251, 191, 36, 0.6) 0%, rgba(255, 223, 0, 0.5) 25%, rgba(168, 85, 247, 0.6) 50%, rgba(139, 92, 246, 0.5) 75%, rgba(251, 191, 36, 0.6) 100%)",
                      boxShadow: "0 0 40px rgba(251, 191, 36, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.08)",
                      borderRadius: "50%",
                    }}
                  />
                  {/* Inner ring */}
                  <div className="absolute top-1/2 left-1/2 rounded-full"
                    style={{
                      width: "380px",
                      height: "380px",
                      transform: "translate(-50%, -50%) rotateX(88deg)",
                      background: "linear-gradient(135deg, rgba(168, 85, 247, 0.5) 0%, rgba(139, 92, 246, 0.4) 30%, rgba(99, 102, 241, 0.3) 50%, rgba(139, 92, 246, 0.4) 70%, rgba(168, 85, 247, 0.5) 100%)",
                      boxShadow: "0 0 30px rgba(168, 85, 247, 0.25)",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              </div>
"@

$newRings = @"
              {/* Saturn rings - Horizontal flat elliptical rings (gold + purple, width > height) */}
              <div className="absolute top-1/2 left-1/2 pointer-events-none" style={{ transform: "translate(-50%, -50%)" }}>
                <div className="relative"
                  style={{
                    width: "560px",
                    height: "120px",
                  }}
                >
                  {/* Outer ring - largest elliptical ring */}
                  <div className="absolute top-1/2 left-1/2 rounded-full"
                    style={{
                      width: "560px",
                      height: "115px",
                      transform: "translate(-50%, -50%)",
                      background: "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.0) 40%, rgba(168, 85, 247, 0.35) 55%, rgba(139, 92, 246, 0.45) 70%, rgba(99, 102, 241, 0.25) 85%, rgba(168, 85, 247, 0.15) 100%)",
                      border: "2px solid rgba(168, 85, 247, 0.5)",
                      boxShadow: "0 0 40px rgba(168, 85, 247, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.1)",
                    }}
                  />
                  {/* Middle-outer gold ring */}
                  <div className="absolute top-1/2 left-1/2 rounded-full"
                    style={{
                      width: "500px",
                      height: "100px",
                      transform: "translate(-50%, -50%)",
                      background: "radial-gradient(ellipse at center, rgba(255, 223, 0, 0.0) 40%, rgba(251, 191, 36, 0.4) 55%, rgba(255, 223, 0, 0.55) 70%, rgba(251, 191, 36, 0.35) 85%, rgba(255, 223, 0, 0.15) 100%)",
                      border: "2px solid rgba(251, 191, 36, 0.6)",
                      boxShadow: "0 0 35px rgba(251, 191, 36, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)",
                    }}
                  />
                  {/* Middle ring - purple */}
                  <div className="absolute top-1/2 left-1/2 rounded-full"
                    style={{
                      width: "430px",
                      height: "85px",
                      transform: "translate(-50%, -50%)",
                      background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.0) 35%, rgba(139, 92, 246, 0.5) 55%, rgba(168, 85, 247, 0.45) 75%, rgba(99, 102, 241, 0.3) 90%, rgba(139, 92, 246, 0.1) 100%)",
                      border: "2px solid rgba(139, 92, 246, 0.55)",
                      boxShadow: "0 0 30px rgba(139, 92, 246, 0.35), inset 0 0 15px rgba(255, 255, 255, 0.08)",
                    }}
                  />
                  {/* Inner ring - gold-purple mix */}
                  <div className="absolute top-1/2 left-1/2 rounded-full"
                    style={{
                      width: "360px",
                      height: "70px",
                      transform: "translate(-50%, -50%)",
                      background: "radial-gradient(ellipse at center, rgba(251, 191, 36, 0.0) 30%, rgba(251, 191, 36, 0.45) 55%, rgba(255, 223, 0, 0.4) 75%, rgba(168, 85, 247, 0.3) 90%, rgba(251, 191, 36, 0.1) 100%)",
                      border: "2px solid rgba(251, 191, 36, 0.5)",
                      boxShadow: "0 0 25px rgba(251, 191, 36, 0.3), inset 0 0 15px rgba(255, 255, 255, 0.08)",
                    }}
                  />
                  {/* Innermost thin ring */}
                  <div className="absolute top-1/2 left-1/2 rounded-full"
                    style={{
                      width: "300px",
                      height: "60px",
                      transform: "translate(-50%, -50%)",
                      border: "2px solid rgba(168, 85, 247, 0.45)",
                      boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)",
                    }}
                  />
                </div>
              </div>
"@

if (-not $content.Contains($oldRings)) {
  Write-Host "ERROR: oldRings not found"
  exit 1
}
$content = $content.Replace($oldRings, $newRings)
Write-Host "Step 4 done: saturn rings replaced with flat horizontal elliptical rings"

# ============ 5. 替换土星星球主体（删除脉冲的动画改为横向旋转）============
$oldPlanet = @"
              {/* Saturn planet - Soft purple gradient with cloud texture */}
              <div className="relative rounded-full"
                style={{
                  width: "280px",
                  height: "280px",
                  background: "radial-gradient(circle at 35% 35%, rgba(216, 180, 254, 0.9) 0%, rgba(168, 85, 247, 0.8) 20%, rgba(139, 92, 246, 0.7) 40%, rgba(99, 102, 241, 0.6) 60%, rgba(79, 70, 229, 0.5) 80%, rgba(49, 46, 129, 0.8) 100%)",
                  boxShadow: "inset -40px -40px 80px rgba(0,0,0,0.5), inset 20px 20px 50px rgba(255, 255, 255, 0.15), 0 0 100px rgba(168, 85, 247, 0.6), 0 0 180px rgba(139, 92, 246, 0.4), 0 0 250px rgba(99, 102, 241, 0.2)",
                  animation: "pulse-glow 5s ease-in-out infinite",
                }}
              >
"@

$newPlanet = @"
              {/* Saturn planet - Horizontal rotation (Y-axis), soft purple gradient with cloud texture */}
              <div className="relative rounded-full overflow-hidden"
                style={{
                  width: "280px",
                  height: "280px",
                  background: "radial-gradient(circle at 35% 35%, rgba(216, 180, 254, 0.9) 0%, rgba(168, 85, 247, 0.8) 20%, rgba(139, 92, 246, 0.7) 40%, rgba(99, 102, 241, 0.6) 60%, rgba(79, 70, 229, 0.5) 80%, rgba(49, 46, 129, 0.8) 100%)",
                  boxShadow: "inset -40px -40px 80px rgba(0,0,0,0.5), inset 20px 20px 50px rgba(255, 255, 255, 0.15), 0 0 100px rgba(168, 85, 247, 0.6), 0 0 180px rgba(139, 92, 246, 0.4), 0 0 250px rgba(99, 102, 241, 0.2)",
                  animation: "pulse-glow 5s ease-in-out infinite",
                }}
              >
                {/* Rotating inner content (clouds rotate around Y axis, horizontal) */}
                <div className="absolute inset-0 rounded-full"
                  style={{
                    animation: "spin-slow 60s linear infinite",
                  }}
                >
"@

if (-not $content.Contains($oldPlanet)) {
  Write-Host "ERROR: oldPlanet not found"
  exit 1
}
$content = $content.Replace($oldPlanet, $newPlanet)
Write-Host "Step 5 done: planet wrapper replaced with horizontal rotation"

# ============ 6. 关闭旋转容器的 div（在行星主体最后一个云元素和 </div> 之间添加关闭）============
# 找到 planet 主体结束处（最后一个 cloud layer 之后的 </div>），并添加闭合
# 当前行星结束结构: 最后一个 cloud </div> 之后是一个 </div> 关闭行星
# 我们在最后一个云元素 </div> 之后添加一个 </div> 以关闭旋转容器
$oldPlanetEnd = @"
                {/* Cloud layer 5 */}
                <div className="absolute rounded-full"
                  style={{
                    top: "75%",
                    left: "20%",
                    width: "90px",
                    height: "35px",
                    background: "linear-gradient(90deg, transparent, rgba(236, 233, 254, 0.25), rgba(216, 180, 254, 0.2), transparent)",
                    transform: "rotate(-5deg)",
                    filter: "blur(5px)",
                    borderRadius: "50%",
                  }}
                />
              </div>
            </div>

            {/* Stats */}
"@

$newPlanetEnd = @"
                {/* Cloud layer 5 */}
                <div className="absolute rounded-full"
                  style={{
                    top: "75%",
                    left: "20%",
                    width: "90px",
                    height: "35px",
                    background: "linear-gradient(90deg, transparent, rgba(236, 233, 254, 0.25), rgba(216, 180, 254, 0.2), transparent)",
                    transform: "rotate(-5deg)",
                    filter: "blur(5px)",
                    borderRadius: "50%",
                  }}
                />
                </div>
              </div>
            </div>

            {/* Stats */}
"@

if (-not $content.Contains($oldPlanetEnd)) {
  Write-Host "ERROR: oldPlanetEnd not found"
  exit 1
}
$content = $content.Replace($oldPlanetEnd, $newPlanetEnd)
Write-Host "Step 6 done: closing rotation div added"

# 保存
Set-Content $file $content -NoNewline
Write-Host "All changes saved successfully!"
