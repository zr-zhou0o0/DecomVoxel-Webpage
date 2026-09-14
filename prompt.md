帮我写一个网页，我想做那种很炫酷的效果，比如 https://microsoft.github.io/TRELLIS/ 这种或者 https://vision-language-kinematics.github.io/ 这种效果，先告诉我你可以读到或者拉取到他们的模板吗？如果可以就照着写。主要是写一个论文的网页，论文的主要思路可以参考 /home/njunfeng/project-zirui/DecomVoxel/README.md ，论文目录/figures/里面的图片你可以引用。

python3 -m http.server 8001


youtube video link:
https://youtu.be/xcu_eHmrXes

（第一页的背景图用 figures/figure1.png 代替）

section:

1. 补充 author 信息：（注意 zhouzirui 是 共一，和 junfengni 都要标注星号；yixinchen 标注 project lead 的dagger符号，然后在下面注明 project lead）

Author Information
Author 1:
Name: Junfeng Ni
Email: njf23@mails.tsinghua.edu.cn
Company/Institution: Tsinghua University
2nd Company/Institution:
City: Beijing
Country: China
ORCID:
Is corresponding author? No
Personal URL:

Author 2:
Name: Zirui Zhou
Email: 2033616887@qq.com
Company/Institution: Tsinghua University
2nd Company/Institution:
City: Beijing
Country: China
ORCID:
Is corresponding author? No
Personal URL:

Author 3:
Name: Yixin Chen
Email: ethanchen@g.ucla.edu
Company/Institution: Beijing Institute for General Artificial Intelligence
2nd Company/Institution:
City: Beijing
Country: China
ORCID:
Is corresponding author? Yes
Personal URL:

Author 4:
Name: Yu Liu
Email: liuyu_ai@foxmail.com
Company/Institution: Tsinghua University
2nd Company/Institution:
City: Beijing
Country: China
ORCID:
Is corresponding author? No
Personal URL:

Author 5:
Name: Nan Jiang
Email: nan.jiang@stu.pku.edu.cn
Company/Institution: Peking University
2nd Company/Institution:
City: Beijing
Country: China
ORCID:
Is corresponding author? No
Personal URL:

Author 6:
Name: Zhifei Yang
Email: zhifei.yeung@gmail.com
Company/Institution: Peking University
2nd Company/Institution:
City: Beijing
Country: China
ORCID:
Is corresponding author? No
Personal URL:

Author 7:
Name: Songchun Zhu
Email: s.c.zhu@pku.edu.cn
Company/Institution: Peking University
2nd Company/Institution:
City: Beijing
Country: China
ORCID:
Is corresponding author? No
Personal URL:

Author 8:
Name: Siyuan Huang
Email: huangsiyuan@ucla.edu
Company/Institution: Beijing Institute for General Artificial Intelligence
2nd Company/Institution:
City: Beijing
Country: China
ORCID:
Is corresponding author? No
Personal URL:


2. code link 改成 active: https://github.com/zr-zhou0o0/DecomVoxel
3. dataset link 改成 active：https://huggingface.co/datasets/zr-zhou/Replica
4. 第一页 “Decom”的字体宽度稍微减少一点；“Voxel”字体不用改动。
5. 网页左上角的 logo 用这个图片 figures/logo.png
6. 主视觉采用 color.py 里面的 green 和 peach 双色配置。
7. 第二页的环节叫做“Intro”而不是“abstract”。

8. 第二页的 Intro 把原来的描述删掉，改成现在的：
We propose DecomVoxel, a framework that integrates guided 3D-native priors to enhance decompositional scene reconstruction. By formulating
object completion as guided in-situ optimization, our method achieves high-quality topology, geometry, and appearance for both individual objects and
backgrounds while strictly preserving original spatial layouts.

9. Intro 里面的 teaser 图片换成这个视频：https://youtu.be/xcu_eHmrXes，视频框的style可以参考 https://robosnap.github.io/，注意使用我们的主色系，可以用渐变色

10. 并且 Intro 除了现在的第 1 2 页以外，还要加一个第 3 页 专门用一个 crousel 之类的可以滑动的栏目展示结果。可以参考 https://robosnap.github.io/ 里面的展示栏目。里面的内容就是 /scenes/里面的图片，分为 blender nyc berlin playroom，并且，每一个scene里面的三张图片是同一个视角的三种渲染方式，因此你应该把它们叠起来、写一个交互装置，支持用户用鼠标引导两条分割线， 分割线分隔开 grid color 和 texture 三种渲染图片。


Decompositional scene reconstruction aims to reconstruct high-quality ob-jects and background, yet existing methods still struggle with the levelof quality under heavy occlusions. While generative priors offer a poten-tial solution, 2D image-based priors often suffer from multi-view inconsis-tency due to a lack of 3D awareness. Conversely, 3D-native priors providestronger structural inductive biases but frequently lead to spatial drift andmisalignment within complex scenes. To address these issues, we proposeDEcoMVoxEL, formulating object completion as a guided in-situ denoisingoptimization that bridges 3D-native priors with neural scene reconstructionOur framework introduces a reformulated epsilon-based distillation loss toensure stable latent refinement, alongside adaptive spatial guidance thatutilizes occupied and vacant anchors with temporal annealing to suppress
generative hallucinations and eliminate spatial drift. Experiments on Replicaand ScanNet++ show that DEcomVoxEL significantly outperforms state-of-the-art methods by strictly preserving the original spatial layout, structuralfidelity, and style-consistent texture. Our method pushes the boundary ofdecompositional reconstruction by delivering high-quality textured mesheswith clean topology, geometry, and appearance, providing a robust solutionfor the holistic reconstruction of complex real-world scenes.

9. 标题可以使用peach色。




1. 第一页的作者 和 副标题 “Harnessing 3D-Native Priors with Guided In-situ Denoising Optimization for Decompositional Scene Reconstruction” 字号都要大一点
2. 第一页 “Decom”的字体宽度稍微减少一点；“Voxel”字体不用改动。
3. 第一页 data、code、paper 这三个的边框用peach色，不要用白色；鼠标悬浮的时候保持原来的green色的效果。
4. 第二页“Complete the unseen. Preserve the scene.”这个section，改成双栏的，视频缩小一点放在右侧，左侧是文字描述。
5. 第二页的文字描述里面 DecomVoxel， topology, geometry, appearance 和 individual objects 和 backgrounds 使用加粗的peach色。 
6. 第三页的 divider 里面的那个带左右箭头的渐变框，改成纯green色的。
7. 尽量在后面的细节、文字、边框等里面多用 peach色系、green色、和少量的purple色系。背景用paperwarm、dark、dark-2交替，不要使用paper色（太白了）。
8. 偶尔可以模仿 https://vision-language-kinematics.github.io/ 用一些类似 tag 的像文本框一样的设计。
8. Intro后面的环节依次是 "Method", "Results", "Analysis", “Citation”。
    - 其中 "Method" 里面根据 main.tex 的内容分为 In-situ Denoising Optimization 和 Adaptive Spatial Guidance 和 Optimization 三个部分，每个部分写一段话或者分条列举，并引用相关的图片，method 主图是 figures/method.png。
    - "Results" 部分也可以做一个滑动栏目，图片在 results，也是分场景拼图。
    - "Analysis" 部分可以，把文章主结果化成一个柱状图，主结果就是 main.tex 里面的评估表格Quantitative comparison 加上result.txt 合成的大表格，只需要cd psnr 两个图就行，参考 plot_quantitative_results.py。不要直接引用图片（不好看），你需要用html重新绘制一下。然后可以 引用 figures/5-varification.png 简单介绍一点消融实验，



1. 顶部栏目“Intro Method Results Analysis Citation” 字号稍微大一点，而且要跟着浏览进度展示出“激活”或者“未激活”两种状态
2. method overview 下面的副标题改成 Our framework bridges 3D generative priors with neural reconstruction through a guided in-situ denoising optimization.
We segment objects from the initial scene and then sequentially optimize their geometry and appearance under adaptive spatial guidance. This process
recovers missing structures and consistent textures while preserving the original scene layout, producing high-fidelity topology, geometry, and appearance.
3. 而且 method overview 的标题和副标题宽度要占整页宽度，而不要现在的偏左半页宽度。（因为下面的图是整页的宽度）
4. result 部分，“Complete scenes, one object at a time.” 改成 Qualitative Comparison.
5. result 的这个滑动窗口，现在的格式、颜色都保持，但是“ours”的两张图片要缩小一点，并且下面放上五张一排的比较小的比较图，依次是 GT、SAM3D、MVSAM3D、ShapeR、SimRecon，需要用tag标明哪张图是哪个。图片都在 /results/ 里面。
6. Analysis / Quantitative comparison 这里的柱状图配色用：peach,peach-dark,green,yellow,purple,dark_purple.


1. 正标题 DecomVoxel 这个栏目宽一点，把DECOMVOXEL放到一行；或者让“decom”字变窄一点，你之前的改动根本没有改这个地方。但是第一页其它的副标题、作者信息等不需要动。
2. Qualitative Comparison 也像 method overview 栏目一样变成整页的宽度
3. Qualitative Comparison 的滑动窗口整体缩小一点；然后下面的 “GT、SAM3D、MVSAM3D、ShapeR、SimRecon” 整体也缩小很多，而且要确保它们五个的整体宽度=上面两个ours的整体宽度，也就是两排图片的宽度对齐。
4. analysis 柱状图里面的yellow改成acid颜色。


1. 现在 decom 的宽度合适了，但是voxel和decom变成一排了。voxel还是放在下一排比较好。
2. Analysis / Quantitative comparison 里面的颜色改成依次用：peach,purple,acid,dark_purple,peach-dark,green

1. 写一个acknowledgement，致谢 Trellis GeoSVR 还有我们参考的网页模板 https://vision-language-kinematics.github.io/ 和 https://robosnap.github.io/，写在最下面，字体小一些


1. https://fictionarry.github.io/GeoSVR-project/ 给geosvr也加引用。
2. Method Overview 里面的3个部分稍微详细一些，可以每个部分内部分分条列举、分析一下，甚至可以引用重点公式。
3. “Each constraint earns its place.” 改成 “Comparison of different optimization strategies. ”，然后后面那段描述文字也改成  Our proposed epsilon-based denoising loss (a), linear noise schedule (b), re-distributed pruning strategy (c), and cosine-power preservation loss weight schedule (d) consistently achieve the most stable convergence.
4. Ablation / Design choices 这里的图片改成用 figures/var-1.png figures/var-2.png figures/var-3.png figures/var-4.png，它们分别对应的小标题是 (a) Denoising Loss Term (b) Noise Sampling 𝑡 Schedule (c) Prune Strategy (d) Preservation Loss Weight 𝑤𝑂 schedule



In-situ Denoising Optimization 里面，左侧第一个栏目可以改成 Preliminaries，2、3栏目不变。

In-situ Denoising Optimization 最下面方框里面的公式渲染有问题 间距过大，而且也不是公式的形态；∇x′Lε = (1 − t)∇x′Lv 稍微好一些。

Adaptive Spatial Guidance 里面的公式的那个小方框可以直接去掉。Optimization 里的公式也可以直接去掉。


Comparison of different optimization strategies 里面的 (c) 变成 copyright 符号了，要改一下；并且这四张 var 图片，宽度分别是 1:2:1:2，现在的四宫格的宽度是 1:1:1:1，所以不协调，把四宫格宽度调整一下。


1. 文字修正+tag修正
2. video？

---


异步更新
navigation 环绕展示场景，也是异步更新



字调大：
“∞
Multi-view
Input images
3D
Native prior
Object-level in-situ completion
Δ
One for all
Topology, Geometry and Appearance
&
Objects & Background
Complete scene output”

“SIGGRAPH ASIA 2026”

“Explore the scene”

“Junfeng Ni1,2,*
Zirui Zhou1,*
Yixin Chen2,†
Yu Liu1,2
Nan Jiang2,3
Zhifei Yang3
Songchun Zhu3
Siyuan Huang2

1 Tsinghua University
2 Beijing Institute for General Artificial Intelligence
3 Peking University

* Equal contribution.
† Project lead.

Paper
soon
Code
Data”

“
Direct manipulation
12 objects 
Drag object
Drag empty space to orbit
Scroll to zoom”




删掉这些话：

“
Orbit around each decomposed reconstruction, then grab any object and reposition it freely. Object collisions are disabled for a faster, lighter viewer.”

“· collisions off
”




我们中了ToG，所以可以把 ACM ToG 也加入这下面这一行？
SIGGRAPH ASIA
2026

放大：
Blender
NYC
Berlin
Playroom

Drag either divider to compare aligned renderings 

所有的这个小标题，统一放大：
Interactive reconstruction / Direct manipulation
Scene explorer / Three rendering modes 
Method / Guided in-situ reconstruction
Results / Geometry to texture
Analysis / Quantitative comparison
Ablation / Design choices
Citation

删掉 “Paper metadata will be updated when the preprint is released.”



---



把这个栏目删掉：“Acknowledgements
We gratefully acknowledge TRELLIS and GeoSVR, whose excellent work provided important foundations for this project. We also thank the creators of the Vision-Language-Kinematics and RoboSnap project pages, which inspired the design and presentation of this website.”


One view，Three readings 这个栏目，能不能在展示框的左侧，再加一个对照的 输入图片栏目？比如左边竖着排列四张输入参考图，右边是现有的这三个可以滑动浏览的栏目，然后如果切换场景的话，左右同时切换。图片就在 scenes_reference 里面。



Method Overview
这些公式都注释掉，暂时不用放出来。

Method Overview 一共有三个大板块，但是每个大板块下面的三个小板块，不要放在正文里。在method的每个板块的右侧开一个小窗口，类似于便签/可滑动的感觉，把三个小板块放到右侧的便签里面。



 Quantitative comparison 方法名称（SimRecon
SAM3D
MV-SAM3D
ShapeR
ReconViaGen
Ours）标注到每个柱状图柱子的下面，而不是在上面打图例。


--- 



这些字放大一点：
01 / Preliminaries 
02 / Anchor
03 / Optimize

We encode each incomplete object segment into a latent representation and optimize it directly in the original scene coordinate system. Instead of uniformly trusting flow-matching gradients at every noise level, we reformulate the objective around the predicted noise residual.
Spatial evidence from the reconstructed scene constrains the stochastic 3D prior. Two complementary anchor sets preserve verified content and prevent geometry from growing into prohibited regions.
The complete scene is recovered in three sequential stages so that background completion, object geometry, and texture refinement can use the most suitable priors while remaining in one coordinate frame.


所有便签里面的字，例如 Key details
Scroll ↕
01
Scene-aligned refinement
Completion occurs in situ, avoiding a separate generation-and-alignment stage that can introduce pose, scale, and rotation errors.

02
Epsilon-based distillation
The predicted residual supervises the latent against sampled noise.

03
Adaptive gradient strength
The adaptive factor suppresses unreliable high-noise updates and strengthens precise low-noise refinement. 也都要放大一点！！！


Quantitative comparison 这两个表格里面的所有字都要放大一点。



修改 Method 的部分。修改 02 03 并添加 04.

02 讲 In-situ Denoising Optimization
把右侧的便签页面注释掉。概括一下下面的文字，凝练成1~2句话来概括，不要涉及公式。

3.2 In-situ Denoising Optimization
A primary objective in decompositional reconstruction is to recover
the complete geometry and appearance of individual objects from
incomplete initial segments {V𝑘}. We formulate this completion as
an in-situ denoising optimization within the scene-level coordinate
space, leveraging a 3D-native generative prior.
Given that initial geometries are typically noisy and incomplete,
a straightforward approach is to encode the initial segment V into a
latent embedding 𝑥′ by the encoder E and leverage the pre-trained
Flow Matching model 𝑣𝜃 to iteratively update 𝑥′ via gradient-based
denoising. Analogous to score-based refinement in diffusion models,
this process uses the velocity field to minimize the discrepancy
between the predicted velocity and the target vector field:
L𝑣 = E𝑡,𝜖 ∥𝑣𝜃 (𝑥𝑡, 𝑡) − (𝜖 − 𝑥′)∥2 2 , (2)
where 𝑥𝑡 = (1 −𝑡)𝑥′ +𝑡𝜖 represents the probability path at timestep
𝑡. However, we empirically observe that directly optimizing Equation (2) often leads to unstable convergence or over-smoothed results. This stems from the fact that L𝑣 treats all noise levels with
uniform gradient importance, failing to account for the varying
structural reliability along the denoising trajectory.
To address this, we rethink the distillation process by drawing
inspiration from the Score Distillation Sampling (SDS) [Poole et al.
2022] paradigm. We propose a reformulated epsilon-based distillation loss for Flow Matching:
L𝜖 = E𝑡,𝜖 ∥𝜖ˆ𝜃 (𝑥𝑡 ; 𝑡) − 𝜖∥2 2 , (3)
where 𝜖ˆ𝜃 (𝑥𝑡 ; 𝑡) = 𝑥𝑡 + (1 −𝑡)𝑣𝜃 (𝑥𝑡, 𝑡) is the noise residual estimated
from the velocity field. By substituting the definition of 𝑥𝑡, we can
express the residual as 𝜖ˆ𝜃 = (1 − 𝑡)𝑥′ + 𝑡𝜖 + (1 − 𝑡)𝑣𝜃.
We formally prove that our proposed objective L𝜖 and the velocity loss L𝑣 share identical gradient directions with respect to
the latent 𝑥′, differing only by a time-dependent scaling factor:
∇𝑥′L𝜖 = (1 − 𝑡)∇𝑥′L𝑣 (see supplementary for the full derivation).
This (1−𝑡) factor arises naturally from 𝜕𝑥𝑡
𝜕𝑥′ = (1−𝑡), which serves as
a principled adaptive scheduler. At high noise levels (𝑡 → 1), where
the generative power is more stochastic, the gradient magnitude
is naturally suppressed to reduce erroneous geometric deformations. Conversely, as the latents converge toward a cleaner manifold
(𝑡 → 0) where the model’s velocity predictions are most accurate


03 讲 Adaptive Spatial Guidance
保留右侧的便签页面。
但是这句话“Spatial evidence from the reconstructed scene constrains the stochastic 3D prior. Two complementary anchor sets preserve verified content and prevent geometry from growing into prohibited regions.”表达的不好，你写的直白一点，就是保留重建置信度高的区域、在重建置信度低的区域加入更多生成 prior。其实主要就是这句话，你把它稍微缩短一点就可以放上去：“To regularize the inherent stochasticity of 3D-native generative
models, which often compromise the spatial fidelity of reconstructed
objects, we propose an adaptive spatial guidance strategy to anchor
the denoising process using spatial constraints and dynamically
balance generative completion and structural preservation”



04 讲 Optimization Pipeline
去掉右侧的便签栏目。然后，描述主要就分为这三段写就可以。

Decompositional reconstruction
GeoSVR produces a global sparse voxel scene, instance masks partition objects and background, and geometric uncertainty initializes reliable anchors.

02
Background completion
Unobserved colors are inpainted and planar depth constraints support re-optimization before extracting the background mesh.

03
Object refinement
A structural grid recovers complete geometry; DINOv2 features back-projected from multiple views initialize appearance latents for texture synthesis.



这一段话的排版改成在“03 / Anchor” 下面，也就是 左侧的两栏是相同宽度、上下排布的，右侧只有一栏是便签栏目，高度与左侧两栏高度之和相等。
Adaptive Spatial Guidance
To regularize the stochasticity of the 3D-native prior, we retain regions with high reconstruction confidence and inject more generative prior into low-confidence regions, balancing structural preservation with completion.




把 Lower geometry error. Sharper rendering. 改成 Quantitative comparison。


把 Ablation / Design choices Comparison of different optimization strategies. 这一页一整页面注释掉。