using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Profiles
{
    public class UserActivityList
    {
        public class Query : IRequest<Result<PagedList<UserActivityDto>>>
        {
            public UserActivityParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<PagedList<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                    .Where(x => x.Attendees.Any(a => a.AppUser.UserName == _userAccessor.GetUsername()))
                    .OrderBy(a => a.Date)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                    .AsQueryable();


                if (request.Params.Predicate == "past")
                {
                    query = query.Where(x => x.Date < DateTime.UtcNow);
                }

                if (request.Params.Predicate == "future")
                {
                    query = query.Where(x => x.Date >= DateTime.UtcNow);
                }

                if (request.Params.Predicate == "hosting")
                {
                    query = query.Where(x => x.HostUsername == _userAccessor.GetUsername());
                }

                return Result<PagedList<UserActivityDto>>.Success(
                    await PagedList<UserActivityDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
                );
            }
        }
    }
}