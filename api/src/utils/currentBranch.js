module.exports = async git => {
  const { current } = await git.branch().catch(console.log);
  return current;
};
