import {
  fd_write,
  iovec,
  errno,
  fd_allocate,
  oflags,
  rights,
  path_open,
  lookupflags,
  fd_close,
} from "wasi";

let fdPtr = memory.data(sizeof<usize>())

let out = memory.data(sizeof<u32>());
let ptr = memory.data(offsetof<iovec>() * 1);
let vec = changetype<iovec>(ptr);

let str = String.UTF8.encode("Hello world!");
vec.buf = changetype<usize>(str);
vec.buf_len = str.byteLength;

let dirfd = <u32>3;
let flags: u16 = oflags.CREAT | oflags.TRUNC;
let fd_rights = rights.FD_WRITE | rights.FD_SEEK | rights.FD_TELL | rights.FD_FILESTAT_GET |
  rights.PATH_CREATE_FILE;
let fd_lookup_flags = lookupflags.SYMLINK_FOLLOW;;
let fd_rights_inherited = fd_rights;
let path = String.UTF8.encode("/example/test.txt");
let res = path_open(
  dirfd,
  fd_lookup_flags,
  changetype<usize>(path), path.byteLength,
  flags,
  fd_rights,
  fd_rights_inherited,
  0,
  fdPtr
);
let theFileDescriptor = load<u32>(fdPtr);
trace("the descriptor", 1, theFileDescriptor);
assert(res == errno.SUCCESS, "Cannot open file.");
// assert(errno.SUCCESS == fd_allocate(theFileDescriptor, 0, str.byteLength), "Cannot allocate in file.");
assert(errno.SUCCESS == fd_write(theFileDescriptor, ptr, 1, out), "Cannot write to file.");
fd_close(theFileDescriptor);
